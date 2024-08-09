export default class UserDto {
  username: string;
  name: string;
  id: string;

  constructor(model: any) {
    this.username = model.username;
    this.name = model.name;
    this.id = model._id;
  }
}