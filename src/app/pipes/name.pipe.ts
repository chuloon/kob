import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'nameShortener' })
export class NameShortenerPipe implements PipeTransform {
    transform(value: string): string {
        let strArray = value.split(" ");
        let newStr = "";
        if(strArray.length >= 2) {
            newStr = `${this.capitalizeFirstLetter(strArray[0])} ${this.capitalizeFirstLetter(strArray[1].charAt(0))}`;
        }
        else if(strArray.length == 1) {
            newStr = `${this.capitalizeFirstLetter(strArray[0])}`;
        }
        return newStr;
    }

    capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}