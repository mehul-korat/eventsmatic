export class Question {
    constructor(
      element: number,
      question: string,
      reactive: string,
      compliant: string,
      proactive: string,
      resilient: string,
      id?: number,
    ) { }
  }
  
  export class Element {
    constructor(
      name: number,
      cat: number,
      seq:number,
      id?: number,
    ) { }
  }
  
  export class Proof {
    constructor(
      element: number,
      type: number,
      proof:string,
      id?: number,
    ) { }
  
  }
  export class Category {
    constructor(
      name: string,
      byline: string,
      image: string,
      id?: number,
    ) { }
  }
  export class UserOld {
    constructor(
      email: string,
      firstname: string,
      lastname: string,
      role: number,
      password:string,
      id?: number,
    ) { }
  }
  export class Milestone {
    constructor(
      milestone: string,
      responsible_persons: any[],
      start_date: Date,
      end_date: Date,
      comment:string,
      status:number
    ) { }
  }