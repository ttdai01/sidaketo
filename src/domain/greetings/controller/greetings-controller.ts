import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
  } from "tsoa";
  
  @Route("/greetings")
  export class UsersController extends Controller {
    @Get("{lang}")
    public async getUser(
      @Path() lang: string,
      @Query() name?: string
    ): Promise<any> {
        let greetings: string = '';
        switch(lang) {
            case 'VN':
                greetings = 'Xin chao';
                break;
            case 'JPN':
                greetings = 'Konichiwa';
                break;
            default:
                greetings = 'Greetings';
                break;
        }
      return {
          message: `${greetings}, ${name}`
      };
    }
  }
  