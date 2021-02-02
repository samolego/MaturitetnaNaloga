export class Avatar {
    baseColor: string;
    eyesType: EyeType;
    mouthType: MouthType;
    decoration: Decoration;
    canvas: HTMLCanvasElement;

    public constructor(baseColor: string, eyesType: EyeType, mouthType: MouthType, decoration: Decoration) {
        this.baseColor = baseColor;
        this.eyesType = eyesType;
        this.mouthType = mouthType;
        this.decoration = decoration;
    }

    public draw(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        // Clearing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        // Outline
        ctx.rect(canvas.width / 2 - canvas.height / 2, 10, canvas.height - 20, canvas.height - 20);

        // Filling with baseColor
        ctx.fillStyle = this.baseColor;
        ctx.fillRect(canvas.width / 2 - canvas.height / 2, 10, canvas.height - 20, canvas.height - 20);

        ctx.stroke();
        ctx.beginPath();
        // Mouth
        ctx.fillStyle = "#000000";
        switch(this.mouthType) {
            case MouthType.BIG:
                ctx.rect(canvas.width / 2 - canvas.height / 2 + 10, canvas.height / 2 + 10, canvas.height - 40, canvas.height / 2 - 30);
                break;

            case MouthType.SURPRISED:
                ctx.arc(canvas.width / 2 - 10, canvas.height / 2 + 25,  canvas.height / 8, 0, 2 * Math.PI);
                break;

            default:
                ctx.arc(canvas.width / 2 - 10, canvas.height / 2, canvas.height / 4, 0, Math.PI);
                break;
        }
        ctx.stroke();

        // Eyes
        let eyeSize;
        switch(this.eyesType) {
            case EyeType.BIG:
                eyeSize = 45;
                break;

            case EyeType.MEDIUM:
                eyeSize = 35;
                break;

            default:
                eyeSize = 20;
                break;
        }
        // First
        ctx.fillStyle = "#000000";
        ctx.fillRect(canvas.width / 2 - canvas.height / 2 + 15, 30, eyeSize, eyeSize);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(canvas.width / 2 - canvas.height / 2 + 18, 34, eyeSize - eyeSize / 2, eyeSize - eyeSize / 2);

        // Second
        ctx.fillStyle = "#000000";
        ctx.fillRect(canvas.width / 2 + canvas.height / 2 - 35 - eyeSize, 30, eyeSize, eyeSize);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(canvas.width / 2 + canvas.height / 2 - 32 - eyeSize, 34, eyeSize - eyeSize / 2, eyeSize - eyeSize / 2);
        ctx.stroke();
    }

    public fromString(stringAvatar: string) {
        const avatar = JSON.parse(stringAvatar);
        return new Avatar(avatar.baseColor, avatar.eyesType, avatar.mouthType, avatar.decoration);
    }
}

export enum MouthType {
    DEFAULT = "Default",
    BIG = "Big",
    SURPRISED = "Surprised"
}

export enum EyeType {
    SMALL = "Small",
    BIG = "Big",
    MEDIUM = "Medium"
}

export enum Decoration {
    DEFAULT = "None",
    HAT = "Hat",
    CAP = "Cap",
    SCARF = "Scarf"
}
