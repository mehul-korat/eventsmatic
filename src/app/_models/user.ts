export class User {
    id: number;
    user_id?: number;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string;
    user_type?: string;
    type?:String;
    // token: string; //Use with live api
    token?: string; //Use with fake backend
    fullname?: string; //Use with fake backend
    address?: string; //Use with fake backend
    state?: string; //Use with fake backend
    city?: string; //Use with fake backend
    zip?: string; //Use with fake backend
    business_id?: string; //Use with fake backend
    phone?: string; //Use with fake backend
    google_id?: string; //Use with fake backend
    facebook_id?: string; //Use with fake backend
    internal_staff?: string; //Use with fake backend
    permission?: string;
}