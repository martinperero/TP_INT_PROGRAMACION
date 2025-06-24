const btn = document.getElementById("ir_arriba");

    window.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 150) {
            btn.classList.remove("d-none");
        } else {
            btn.classList.add("d-none");
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });