let stats = {
    commits: 28,
    branches: 6,
    merges: 12,
    conflicts: 4
};

function updateUI() {
    document.getElementById("commits").textContent = stats.commits;
    document.getElementById("branches").textContent = stats.branches;
    document.getElementById("merges").textContent = stats.merges;
    document.getElementById("conflicts").textContent = stats.conflicts;
}

function logActivity(message) {
    const log = document.getElementById("log");
    const item = document.createElement("li");
    item.textContent = message;
    log.prepend(item);
}

function runAction(action) {
    const time = new Date().toLocaleTimeString();

    switch (action) {
        case "init":
            logActivity(`[${time}] Repository initialized`);
            break;

        case "commit":
            stats.commits++;
            logActivity(`[${time}] Commit created`);
            break;

        case "branch":
            stats.branches++;
            logActivity(`[${time}] New branch created`);
            break;

        case "merge":
            stats.merges++;
            logActivity(`[${time}] Branch merged`);
            break;

        case "resolve":
            stats.conflicts++;
            logActivity(`[${time}] Merge conflict resolved`);
            break;

        case "push":
            logActivity(`[${time}] Changes pushed to GitHub`);
            break;
    }

    updateUI();
}

/* Sidebar Active Toggle */
document.querySelectorAll(".sidebar ul li").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".sidebar ul li")
            .forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});

updateUI();
