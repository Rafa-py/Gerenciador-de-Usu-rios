class User{
    static data(value){
        let date = new Date();
        value["date"] = Utils.dateFormat(date);
        let formateData = JSON.stringify(value);
        localStorage.setItem(value["id"], formateData);
        // console.log(value)
    }
    static updateData(value, id){
        let oldUser = JSON.parse(localStorage.getItem(id));
        let date = new Date();
        value["date"] = Utils.dateFormat(date);
        let newUser = JSON.stringify(Object.assign(oldUser, value));
        localStorage.removeItem(id);
        localStorage.setItem(id, newUser);
    }
    static removeData(velue){
        localStorage.removeItem(value);
    }
}