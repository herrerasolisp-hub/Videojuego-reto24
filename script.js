console.log("El archivo script.js está cargando correctamente.");

class Jugador {
    constructor(nombre, salud, color) {
        this.nombre = nombre;
        this.salud = salud;
        this.color = color;
    }

    atacar(objetivo) {
        let dano = Math.floor(Math.random() * 11) + 8;
        objetivo.salud -=dano;
        if (objetivo.salud <0) {
            objetivo.salud = 0;
        }
        return dano;
    }

    curar() {
        let recuperacion = Math.floor(Math.random() * 16) + 10;
        this.salud += recuperacion;
        if (this.salud > 100) {
            this.salud = 100;
        }
        return recuperacion;
    }
}

class Juego {
    constructor() {
        this.jugador1 = new Jugador("Guerrero", 100, "#ef4444");
        this.jugador2 = new Jugador("Mago", 100, "#3b82f6");
        this.turnoActual = null;
        this.juegoActivo = false;
    }

    inicializarReferenciasDOM() {
        this.elemHealth1 = document.getElementById("health-1");
        this.elemHealthText1 = document.getElementById("health-text-1");
        this.elemHealth2 = document.getElementById("health-2");
        this.elemHealthText2 = document.getElementById("health-text-2");
        this.elemTurnIndicator = document.getElementById("turn-indicator");
        this.elemLog = document.getElementById("game-log");

        this.btnAttack = document.getElementById("btn-attack");
        this.btnHeal = document.getElementById("btn-heal");
        this.btnRestart = document.getElementById("btn-restart");
    }

    iniciarJuego() {
        this.jugador1.salud = 100;
        this.jugador2.salud = 100;
        this.juegoActivo = true;
        this.elemLog.innerHTML = "";

        this.turnoActual = Math.floor(Math.random() *2) + 1;

        this.registrarEnLog("¡El juego ha comenzado!");
        let nombreTurnoInicial = this.turnoActual === 1 ? this.jugador1.nombre : this.jugador2.nombre;
        this.registrarEnLog(`¡El volado determinó que inicia el turno de ${nombreTurnoInicial}!`);

        this.actualizarInterfaz();
    }

    cambiarDeTurno() {
        if (!this.juegoActivo) return;

        this.turnoActual = this.turnoActual === 1 ? 2 : 1;
        let nombreSiguiente = this.turnoActual === 1 ? this.jugador1.nombre : this.jugador2.nombre;
        this.registrarEnLog(`Turno cambiado. Ahora le toca a ${nombreSiguiente}.`);
        this.actualizarInterfaz();
    }

    registrarEnLog(mensaje) {
        let entrada = document.createElement("div");
        entrada.className = "log-entry";
        entrada.textContent = mensaje;
        this.elemLog.appendChild(entrada);
        this.elemLog.scrollTop = this.elemLog.scrollHeight;
    }

    reiniciarJuego(){
        this.iniciarJuego();
    }

    manejarAtaque() {
        if (!this.juegoActivo) return;

        let atacante = this.turnoActual === 1 ? this.jugador1 : this.jugador2;
        let defensor = this.turnoActual === 1 ? this.jugador2 : this.jugador1;
        
        let danoAplicado = atacante.atacar(defensor);
        this.registrarEnLog(`${atacante.nombre} atacó a ${defensor.nombre} causando ${danoAplicado} puntos de daño.`);

        this.verificarFinDeJuego(defensor);
        if (this.juegoActivo) {
            this.cambiarDeTurno();
        }
    }

    manejarCuracion() {
        if (!this.juegoActivo) return;

        let jugadorActual = this.turnoActual === 1 ? this.jugador1 : this.jugador2;
        let saludAnterior = jugadorActual.salud;
        let cantidadCurada = jugadorActual.curar();

        this.registrarEnLog(`${jugadorActual.nombre} se curó recuperando ${cantidadCurada} puntos de salud.`);

        this.verificarFinDeJuego();
        if (this.juegoActivo) {
            this.cambiarDeTurno();
        }
    }

    verificarFinDeJuego(oponente = null) {
        if (this.jugador1.salud <= 0 || this.jugador2.salud <= 0) {
            this.juegoActivo = false;
            let ganador = this.jugador1.salud > 0 ? this.jugador1.nombre : this.jugador2.nombre;
            this.registrarEnLog(`¡FIN DEL JUEGO! El ganador es ${ganador} 🏆.`);
            this.actualizarInterfaz();
        }
    }

    actualizarInterfaz() {
        this.elemHealth1.value = this.jugador1.salud;
        this.elemHealthText1.textContent = `${this.jugador1.salud} / 100`;

        this.elemHealth2.value = this.jugador2.salud;
        this.elemHealthText2.textContent = `${this.jugador2.salud} / 100`;

        if (this.juegoActivo) {
            let nombreTurno = this.turnoActual === 1 ? this.jugador1.nombre : this.jugador2.nombre;
            this.elemTurnIndicator.textContent = `Turno de. ${nombreTurno}`;
            this.btnAttack.disabled = false;
            this.btnHeal.disabled = false;
        } else {
            this.elemTurnIndicator.textContent = "Juego Terminado";
            this.btnAttack.disabled = true;
            this.btnHeal.disabled = true;
        }
    }
}

window.addEventListener("load", () => {
    new Juego();
});