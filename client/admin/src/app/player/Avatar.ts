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
        
        const lX = canvas.width / 2 - canvas.height / 2; // Left x
        const rX = canvas.width / 2 + canvas.height / 2; // Right x

        // Clearing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        // Outline
        ctx.rect(lX, 0, canvas.height, canvas.height);

        // Filling with baseColor
        ctx.fillStyle = this.baseColor;
        ctx.fillRect(lX, 0, canvas.height, canvas.height);

        ctx.stroke();
        ctx.beginPath();

        // Mouth
        ctx.fillStyle = "#000000";
        switch(this.mouthType) {
            case MouthType.BIG:
                ctx.rect(lX + lX / 10, canvas.height / 2, canvas.width / 2 - lX / 10, canvas.height / 2 - 30);
                break;

            case MouthType.SURPRISED:
                ctx.arc(canvas.width / 2, canvas.height / 2 + canvas.height / 4,  canvas.height / 8, 0, 2 * Math.PI);
                break;

            default:
                ctx.arc(canvas.width / 2, canvas.height / 2 + canvas.height / 8,  canvas.height / 4, 0, Math.PI);
                break;
        }
        ctx.stroke();

        // Eyes
        let eyeSize;
        switch(this.eyesType) {
            case EyeType.BIG:
                eyeSize = 4;
                break;

            case EyeType.MEDIUM:
                eyeSize = 5;
                break;

            default:
                eyeSize = 6;
                break;
        }

        console.log(lX, canvas.height / 10, lX + canvas.height / eyeSize, canvas.height / 10 + canvas.height / eyeSize);
        console.log(rX, canvas.height / 10, rX - canvas.height / eyeSize, canvas.height / 10 + canvas.height / eyeSize);

        // Left eye
        ctx.fillStyle = "#000000";
        ctx.fillRect(lX + canvas.height / 8, canvas.height / 10, canvas.height / eyeSize, canvas.height / 10 + canvas.height / eyeSize);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(lX + canvas.height / 8, canvas.height / 10, canvas.height / (eyeSize * 2), canvas.height / 10 + canvas.height / (eyeSize * 2));

        // Right eye
        ctx.fillStyle = "#000000";
        ctx.fillRect(rX - canvas.height / 8, canvas.height / 10, - canvas.height / eyeSize, canvas.height / 10 + canvas.height / eyeSize);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(rX - canvas.height / 8, canvas.height / 10, - canvas.height / (eyeSize * 2), canvas.height / 10 + canvas.height / (eyeSize * 2));
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
