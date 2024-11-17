import { Response } from 'express';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
export declare class AppController {
    private readonly userService;
    private readonly postService;
    private readonly appService;
    constructor(userService: UserService, postService: PostService, appService: AppService);
    renderHomePage(res: Response): void;
}
