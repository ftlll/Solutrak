import { Utilities } from './../utilities';

export class NavItem {
    constructor(name,  title,  route,  imgHeight) {
        this.isActive = false;
        this.isEnabled = true;

        this.imgHeight=imgHeight;
        this.isHovered = false;
        this.title = title;
        this.route = route;

        if (Utilities.IsValidString(name))
            this.src = '/assets/img/' + name;
        
    }
}
