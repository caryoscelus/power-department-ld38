interface GameText{
    friendlyName: string
    specials: string[],
    text: string
    next: string[]
}


export class GameSetup extends Phaser.State {
    private slickUI: any;
    private music: Phaser.Sound;
    private texts: {[p: string]: GameText};
    private textIndex: string;
    private textElement: SlickUI.Element.Text;
    private panel: SlickUI.Element.Panel;
    private buttons: SlickUI.Element.Button[];
    private name: string;
    private difficulty: string;

    init(slickUI: any){
        this.slickUI = slickUI;
    }

    create() {
        this.music = this.add.audio("setup_music");
        this.music.loopFull(0.5);

        let panel = new SlickUI.Element.Panel(100, 100, 800, 400);
        this.slickUI.add(panel);
        this.panel = panel;

        this.texts = this.game.cache.getJSON("setup_text");
        this.textIndex = "0";
        this.textElement = new SlickUI.Element.Text(0, 0, "");
        panel.add(this.textElement);

        this.name = "";
        this.buttons = [];
        this.setTextAndRunSpecials();

        this.difficulty = "easy";

    }

    update(){

    }

    private setTextAndRunSpecials() {
        this.runSpecials();

        this.textElement.value = this.texts[this.textIndex].text.replace("{name}", this.name);

        this.setupButtons();
    }

    private setupButtons() {
        this.clearButtons();
        this.addNewButtons();
    }

    private addNewButtons() {
        let y = 250;
        let gameText = this.texts[this.textIndex];
        for (let next of gameText.next) {
            let nextText = this.texts[next];
            let button = new SlickUI.Element.Button(700, y, 100, 50);
            let buttonText = new SlickUI.Element.Text(0, 0, nextText.friendlyName);
            this.panel.add(button);
            button.add(buttonText).center();

            let setup = this;
            button.events.onInputUp.add(function () {
                setup.textIndex = next;
                setup.setTextAndRunSpecials();
            });
            y += 50;
            this.buttons.push(button);
        }
    }

    private clearButtons() {
        for (let button of this.buttons) {
            button.container.displayGroup.destroy(true);
        }
        this.buttons = [];
    }

    private runSpecials() {
        for (let special of this.texts[this.textIndex].specials) {
            if (special === "set-difficulty-easy") {
                this.difficulty = "easy";
            } else if (special === "set-difficulty-medium") {
                this.difficulty = "medium";
            } else if (special === "set-difficulty-hard") {
                this.difficulty = "hard";
            } else if (special === "start-game") {
                this.startGame();
            }
        }
    }

    private startGame() {
        this.music.destroy();
        this.panel.container.displayGroup.destroy(true);
        this.game.state.start("main", false, false, this.slickUI, this.difficulty);
    }
}
