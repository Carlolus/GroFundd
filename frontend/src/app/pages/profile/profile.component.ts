import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/interfaces/user.interface';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    user: User | null = null;
    constructor(private authService: AuthService) {

    }
    ngOnInit(): void {
        this.user = this.authService.getUserTyped();
    }
}
