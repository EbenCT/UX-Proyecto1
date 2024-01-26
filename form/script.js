const form = document.getElementById('form');
const progressBarTop = document.getElementById('progress-bar-inner-top');
const stepTitles = document.querySelectorAll('.step-title');

function updateProgressBar(step) {
    const percentage = (step - 1) * 33.33;
    progressBarTop.style.width = `${percentage}%`;
}

function updateStepTitles(step) {
    // Muestra solo los títulos de los pasos anteriores y el paso actual
    for (let i = 1; i <= 4; i++) {
        const stepTitle = document.getElementById(`step-title-${i}`);
        if (i <= step) {
            stepTitle.style.display = 'inline-block';
        } else {
            stepTitle.style.display = 'none';
        }
        if (i === step) {
            stepTitle.classList.add('active');
        } else {
            stepTitle.classList.remove('active');
        }
    }
}

function nextStep(step) {
    form.style.transform = `translateX(-${100 * (step - 1)}%)`;
    updateProgressBar(step);
    updateStepTitles(step);
}

function prevStep(step) {
    form.style.transform = `translateX(-${100 * (step - 1)}%)`;
    updateProgressBar(step);
    updateStepTitles(step);
}

// Asigna los eventos a los títulos del menú
stepTitles.forEach((title, index) => {
    title.addEventListener('click', () => {
        nextStep(index + 1);
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Oculta los títulos de los pasos 2, 3 y 4 al cargar la página
    for (let i = 2; i <= 4; i++) {
        const stepTitle = document.getElementById(`step-title-${i}`);
        stepTitle.style.display = 'none';
    }
});

/*para el menu */
