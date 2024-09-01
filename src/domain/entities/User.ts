export class User {
    public id: string | null
    public username: string
    public password: string | null
    public email: string
    public picture: string

    constructor({
        id = null,
        username,
        password = null,
        email,
        picture,
    }: {
        id?: string | null
        username: string
        password?: string | null
        email: string
        picture: string
    }) {
        this.id = id
        this.username = username
        this.password = password
        this.email = email
        this.picture = picture
    }
}
