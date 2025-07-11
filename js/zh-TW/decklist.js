// Global Variables ================================================
const ACCESS_TOKEN = localStorage.getItem("access_token");
const FOLDER_NAME = "_decksimulator";

// Helpers =========================================================
async function gapiRequest(method, url, body = null, params = null) {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "../../";
        return;
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    let finalUrl = url;
    if (params) {
        const query = new URLSearchParams(params).toString();
        finalUrl += `?${query}`;
    }

    const response = await fetch(finalUrl, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
        if (response.status === 401) {
            console.warn("Access token 已失效，導回首頁");
            localStorage.removeItem("access_token");
            window.location.href = "../../";
            return;
        }

        const error = await response.json().catch(() => ({}));
        console.error("Google API error", error);
        throw new Error(error.error?.message || "Unknown error");
    }

    return await response.json();
}
 
async function findOrCreateDecksimulatorFolder() {
    const query = `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const res = await gapiRequest("GET", "https://www.googleapis.com/drive/v3/files", null, {
        q: query,
        fields: "files(id, name)"
    });

    if (res?.files?.length > 0) {
        return res.files[0].id;
    }

    const createRes = await gapiRequest("POST", "https://www.googleapis.com/drive/v3/files", {
        name: FOLDER_NAME,
        mimeType: "application/vnd.google-apps.folder"
    });

    return createRes.id;
}

async function createDeckSheet(deckName, folderId) {
    const now = new Date();
    const formatted = now.toLocaleString("sv-SE", { hour12: false })
        .replace(/[-:T]/g, "")
        .replace(" ", "_");

    const sheetTitle = `_decksimulator_${deckName}_${formatted}`;

    const file = await gapiRequest("POST", "https://www.googleapis.com/drive/v3/files", {
        name: sheetTitle,
        mimeType: "application/vnd.google-apps.spreadsheet",
        parents: [folderId]
    });

    return file.id;
}

async function listDeckSheets() {
    const folderId = await findOrCreateDecksimulatorFolder();

    const query = `'${folderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;
    const res = await gapiRequest("GET", "https://www.googleapis.com/drive/v3/files", null, {
        q: query,
        fields: "files(id, name, createdTime)"
    });

    const decks = [];

    for (const file of res.files ?? []) {
        const prefix = "_decksimulator_";
        if (!file.name.startsWith(prefix)) continue;

        const raw = file.name.substring(prefix.length);
        const match = raw.match(/^(.*)_(\d{8}_\d{6})$/);
        if (!match) continue;

        const deckName = match[1];
        const rawTime = match[2];

        const dateObj = new Date(file.createdTime);

        decks.push({
            id: file.id,
            name: deckName,
            created: dateObj.toLocaleString(),
        });
    }

    console.log("找到的牌組列表：", decks);
    return decks;
}

// Main ============================================================
async function createDeck(element) {
    const form = document.querySelector("#createDeckForm");
    const input = form.querySelector(".deck-name");
    const deckName = input.value.trim();

    if (!deckName) {
        alert("請輸入牌組名稱");
        return;
    }

    if (deckName.length > 20) {
        alert("牌組名稱不得超過 20 個字");
        return;
    }

    element.disabled = true;
    element.innerText = "建立中...";

    try {
        const folderId = await findOrCreateDecksimulatorFolder();
        const sheetId = await createDeckSheet(deckName, folderId);
        alert(`已建立牌組 ${deckName}，ID: ${sheetId}`);
        await listDeckSheets(); // 可加載或刷新列表
    } catch (err) {
        console.error(err);
        alert("建立失敗：" + err.message);
    } finally {
        element.disabled = false;
        element.innerText = "新建";
    }
}

async function refreshDeckList() {
    const decks = await listDeckSheets();
    const $list = $('#deckList');

    $list.children('li:not(:first)').remove();

    for (const deck of decks) {
        const appendstr = `
        <li class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3">
            <div class="card h-100">
                <div class="card-body position-relative pt-card">
                    <button class="btn btn-outline-light border-0 shadow-none outline-0 d-flex justify-content-center align-items-center position-absolute top-0 end-0 bottom-0 start-0 p-0 m-0" type="button" onclick="editDeck('${deck.id}');">
                        <p class="m-0 text-truncate w-100 text-center px-2">
                            ${deck.name}
                        </p>
                    </button>
                </div>
                <div class="card-footer text-center small text-muted">
                    ${deck.created}
                </div>
            </div>
        </li>`;
        $list.append(appendstr);
    }
}


// Web Start =======================================================
$(function () {
    if (!ACCESS_TOKEN) {
        window.location.href = "../../";
        return;
    }

    console.log(`Access Token 確認成功\n${ACCESS_TOKEN}`);
    listDeckSheets();
});
