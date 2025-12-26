function animateCounter(id, target) {
    let count = 0;
    const element = document.getElementById(id);
    const interval = setInterval(() => {
        count++;
        element.textContent = count;
        if (count === target) clearInterval(interval);
    }, 40);
}

window.onload = () => {
    animateCounter("commits", 28);
    animateCounter("branches", 6);
    animateCounter("merges", 12);
    animateCounter("conflicts", 4);
};
