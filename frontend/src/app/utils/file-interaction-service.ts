import { Service } from '@angular/core';

@Service()
export class FileInteractionService {
    public selectFileAsync(): Promise<File | undefined> {
        return new Promise<File | undefined>((resolve, _) => {
            const tempInput = document.createElement("input");
            tempInput.type = "file";
            tempInput.click();

            tempInput.addEventListener("input", () => {
                try {
                    const file = tempInput.files!.item(0);
                    if (file === null) {
                        resolve(undefined);
                        return;
                    }

                    resolve(file);
                } finally {
                    tempInput.remove();
                }
            });

            tempInput.addEventListener("cancel", () => {
                tempInput.remove();
                resolve(undefined);
            })
        });
    }

    public downloadFile(fileName: string, content: string) {
        const blob = new Blob([content], { type: "text/plain" });
        const objectUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = objectUrl;
        downloadLink.download = fileName;
        downloadLink.target = "_blank";
        downloadLink.click();

        URL.revokeObjectURL(objectUrl);
    }
}
