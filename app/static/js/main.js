function mostrarAlerta(tipo, mensaje) {
    const container = document.getElementById('alert-container');
    if (!container) return;
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.innerHTML = `${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    container.appendChild(alerta);
    setTimeout(() => alerta.remove(), 5000);
}
