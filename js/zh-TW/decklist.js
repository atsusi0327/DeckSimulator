// Global Variables ================================================
const ACCESS_TOKEN = localStorage.getItem("access_token");
const FOLDER_NAME = "_decksimulator";

// Helpers =========================================================
async function gapiRequest(method, url, body = null, params = null) {
    const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
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
        const error = await response.json();
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

    if (res.files.length > 0) {
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
    const formatted = now.toLocaleString("sv-SE", { hour12: false }).replace(/[-:T]/g, "").replace(" ", "_");
    const sheetTitle = `_decksimulator_${deckName}_${formatted}`;

    // Create sheet
    const file = await gapiRequest("POST", "https://www.googleapis.com/drive/v3/files", {
        name: sheetTitle,
        mimeType: "application/vnd.google-apps.spreadsheet",
        parents: [folderId]
    });

    return file.id;
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

    element.disabled = true;
    element.innerText = "建立中...";

    try {
        const folderId = await findOrCreateDecksimulatorFolder();
        const sheetId = await createDeckSheet(deckName, folderId);
        alert(`已建立牌組 ${deckName}，ID: ${sheetId}`);
        // TODO: 你可以在這邊進一步導向或渲染列表
    } catch (err) {
        console.error(err);
        alert("建立失敗：" + err.message);
    } finally {
        element.disabled = false;
        element.innerText = "新建";
    }
}


// Web Start =======================================================
$(function () {
    if (!ACCESS_TOKEN) {
        window.location.href = "../../";
        return;
    }

    console.log(`Access Token 確認成功${ACCESS_TOKEN}`);
});
