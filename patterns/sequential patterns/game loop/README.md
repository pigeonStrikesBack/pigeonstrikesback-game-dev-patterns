# pattern-name Game Loop

📑 [Click here](./pattern-name.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition

The sources do not provide the Gang of Four's definition of the Game Loop pattern. However, mentions that "Design patterns are typical solutions to common problems in software design." and states they are categorized by intent.

### Robert Nystrom's definition

**Un game loop gira continuamente durante il gameplay. Ad ogni ciclo del loop, elabora l'input dell'utente senza bloccarsi, aggiorna lo stato del gioco e renderizza il gioco. Traccia il passare del tempo per controllare la velocità del gameplay**.

### AI-generated definition

The sources do not contain an AI-generated definition of the Game Loop pattern.

## Use Cases

### use case 1: Decoupling the progression of game time from user input and processor speed

Il Game Loop è essenziale per **disaccoppiare la progressione del tempo di gioco dall'input dell'utente e dalla velocità del processore**. Questo assicura che il gioco funzioni a una velocità consistente indipendentemente dall'hardware sottostante.

### use case 2: Running the game at a consistent speed

Un altro compito chiave di un game loop è **far funzionare il gioco a una velocità costante nonostante le differenze nell'hardware sottostante**.

### use case 3: Handling user input, updating game state, and rendering

Ad ogni ciclo, il game loop **elabora l'input dell'utente senza bloccarsi, aggiorna lo stato del gioco e renderizza il gioco**.

### use case 4: Keeping visual and audible states running in turn-based games

Anche nei giochi a turni, dove lo stato del gioco non avanza fino a quando l'utente non fa la sua mossa, **gli stati visivi e udibili del gioco di solito continuano**. Animazioni e musica continuano a funzionare anche quando il gioco sta "aspettando" che tu faccia la tua mossa.

## General Examples

### Example 1: Simple Game Loop

Descrizione: Un esempio basilare di un game loop che chiama fittizi metodi per l'input, l'aggiornamento e il rendering.

```cpp
void gameLoop() {
  while (true) {
    handleInput();
    update();
    render();
  }
}
```

<details>
<summary> code (👆 click here to show) </summary>

```cpp
void handleInput() {
  // Leggi l'input dell'utente
}

void update() {
  // Aggiorna lo stato del gioco
}

void render() {
  // Disegna il gioco
}

void gameLoop() {
  while (true) {
    handleInput();
    update();
    render();
  }
}
```

</details>

### Example 2: Game Loop con gestione dell'uscita

Descrizione: Una variazione del game loop che include una condizione per uscire dal ciclo.

```cpp
bool isDone = false;

void handleInput() {
  // Leggi l'input dell'utente e imposta isDone se necessario
}

void update() {
  // Aggiorna lo stato del gioco
}

void render() {
  // Disegna il gioco
}

void gameLoop() {
  while (!isDone) {
    handleInput();
    update();
    render();
  }
}
```

<details>
<summary> code (👆 click here to show) </summary>

```cpp
bool isDone = false;

void handleInput() {
  // Leggi l'input dell'utente e imposta isDone se necessario
  // Ad esempio, se viene premuto un tasto di uscita:
  // isDone = true;
}

void update() {
  // Aggiorna lo stato del gioco
}

void render() {
  // Disegna il gioco
}

void gameLoop() {
  while (!isDone) {
    handleInput();
    update();
    render();
  }
}
```

</details>

## PROS and CONS

<details><summary>PROS</summary>

- **Essenziale per la maggior parte dei giochi**.
- **Disaccoppia la progressione del tempo di gioco dall'input dell'utente e dalla velocità del processore**.
- Permette di **eseguire il gioco a una velocità costante**.
- Fornisce un **punto centrale per l'elaborazione dell'input, l'aggiornamento dello stato e il rendering**.
</details>

<details><summary>CONS</summary>

- Richiede attenzione all'**efficienza**, poiché è una parte cruciale del codice che viene eseguita frequentemente.
- Può richiedere una **coordinazione con il loop degli eventi della piattaforma** sottostante se si sta costruendo su un sistema operativo con un'interfaccia utente grafica.
- La gestione di un **time step variabile** (dove ogni ciclo simula una fetta di tempo diversa) può aggiungere complessità.
</details>

## Conclusion

Il **Game Loop** è un pattern fondamentale nell'architettura dei giochi. Definisce la struttura di base di come un gioco gira, gestendo l'input dell'utente, aggiornando lo stato del gioco e renderizzando la grafica in un ciclo continuo. La sua importanza risiede nella sua capacità di disaccoppiare la logica del gioco dalla velocità dell'hardware, garantendo un'esperienza di gioco consistente. Sebbene concettualmente semplice, la sua implementazione richiede attenzione all'efficienza e alla potenziale interazione con i loop degli eventi della piattaforma sottostante. In sintesi, il Game Loop è il cuore pulsante di quasi tutti i giochi.