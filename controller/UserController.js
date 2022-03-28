class Controller{
    constructor(){
        this.form = document.querySelector("#form-create");
        this.formUpdateEl = document.querySelector("#form-update");
        this.tableEl = document.querySelector("#table-users");
        this.onload();
        this.onSubmit();
        this.updateTableUser();

    }
    onload(){
        setTimeout(()=>{
            this.delete();
            this.updateData();
            this.userCounter();
        }, 500)
    };
    userCounter(){
        let userText = document.querySelector("#number-users"); 
        let userLength = localStorage.length.toString();
        userText.innerHTML = userLength;        
        
        let adminText = document.querySelector("#number-users-admin");
        let lengthLocal = Object.keys(localStorage).sort();
        let counter = 0;
        for(let i in lengthLocal){
            let indexUsers = lengthLocal[i]
            let dataUsers = JSON.parse(localStorage.getItem(indexUsers));
            if(dataUsers.admin == "Sim"){
                counter += 1;
            }
        }
        adminText.innerHTML = counter;
    };
    onSubmit(){
        this.form.addEventListener("submit", event=>{

            event.preventDefault();
            let btn = document.querySelector("#submit");
            btn.disable = true;

            this.getValues(this.form).then((user)=>{
                user["id"] = this.setId();
                User.data(user);
                this.addLine(user);
                btn.disable = false;
                location.reload();
            });
        })
    }//Closing the onSubmit method.
    updateData(){
        let btn = document.querySelectorAll("#btn-edit");
        btn.forEach((item)=>{
            item.addEventListener("click", ()=>{
                let idbutton = item.parentElement.childNodes[5].value;   
                this.showEditTable()
                this.loadDataInTheTable(idbutton)
                    .then((item)=>{
                        let btnUpdate = document.querySelector("#btn-up");
                        btnUpdate.addEventListener("click", (e)=>{
                            btnUpdate.disable = true; 
                            e.preventDefault();   
                            this.getValues(this.formUpdateEl).then((user)=>{
                                User.updateData(user, idbutton);
                                this.updateTableUser();
                                this.hideEditTable();
                                btnUpdate.disable = false; 
                                location.reload();
                            })
                        });
                    });
            },false);
        });
        let cancel = document.querySelector("#cancel-up");
        cancel.addEventListener("click", ()=>{
            this.hideEditTable();
        });
    };
    loadDataInTheTable(id){
        return new Promise((resolve)=>{
            let userData = JSON.parse(localStorage.getItem(id));
            console.log(userData, "userData")
            let form = this.formUpdateEl.elements;
            [...form].forEach((item)=>{
                if(item.name == "admin"){
                    let admin = document.querySelector("#admin-update");
                    if(userData.admin == "Sim"){
                        admin.checked = true;
                    }else{
                        admin.checked = false;
                    }
                }
                if(item.name == "gender"){
                    let male = document.querySelector("#updateInputGenderM");
                    let female = document.querySelector("#updateInputGenderF");
                    let other = document.querySelector("#updateInputGenderO");
                    if(userData.gender == "M"){
                        male.checked = true
                    }else if(userData.gender == "F"){
                        female.checked = true
                    }else{
                        other.checked = true
                    }
                }
                switch(item.name){
                    case 'name':
                        item.value = userData.name;
                        break;
                    case 'email':
                        item.value = userData.email
                        break;
                    case 'birth':  
                        item.value = userData.birth
                        break;
                    case 'country':
                        item.value = userData.country
                        break;
                    case 'password':
                        item.value = userData.password
                        break;
                }
            });
            resolve("Formulário Atualizado com sucesso!")
        })
    }//Closing loadDataInTheTable method.
    showEditTable(){
        this.formUpdateEl.style.display = "block";
        this.form.style.display = "none";
    };
    hideEditTable(){
        this.formUpdateEl.style.display = "none";
        this.form.style.display = "block";
    };
    getDataFromTheLocalStorage(user){
        return new Promise((resolve)=>{
            let userItem = JSON.parse(localStorage.getItem(user));
            resolve(userItem);
        });
    }
    updateTableUser(){
        this.tableEl.innerHTML = "";
        let sizeLocal = localStorage.length
        if(sizeLocal > 0){
            let lengthLocal = Object.keys(localStorage).sort();
            for(let i in lengthLocal){
                let data = lengthLocal[i]
                this.getDataFromTheLocalStorage(data).then((user)=>{
                    let date = new Date()
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                            <td><img class="img_table" src="${user.photo}" alt="">
                            </td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.admin}</td>
                            <td>${user.date}</td>
                            <td>
                                <button class="edit" id="btn-edit">Editar</button>
                                <button class="delete" id="btn-delete">Excluir</button>
                                <input type="hidden" name="id" id="id" value="${user.id}">
                        </td>
                `
                this.tableEl.appendChild(tr)
                });
            }
        };
    }
    delete(){
        let btn = document.querySelectorAll("#btn-delete");
        btn.forEach((item)=>{
            item.addEventListener("click", ()=>{
                let id = item.parentElement.childNodes[5].value;
                this.removeFromTheLocalStorage(id).then((response)=>{
                    console.log(response)
                    this.updateTableUser();
                    location.reload();
                });
            })
        });
    }; //Closing the delete() methodo.
    removeFromTheLocalStorage(value){
        return new Promise((resolve) =>{
            localStorage.removeItem(value);
            resolve("Deu bom");
        })
    }
    addLine(value){
        let tr = document.createElement("tr");

        tr.innerHTML = `
        <td><img class="img_table" src="${value.photo}" alt="">
        </td>
        <td>${value.name}</td>
        <td>${value.email}</td>
        <td>${value.admin}</td>
        <td>${value.date}</td>
        <td>
            <button class="edit" id="btn-edit">Editar</button>
            <button class="delete" id="btn-delete">Excluir</button>
            <input type="hidden" name="id" id="id" value="${value.id}">
        </td>
    `
        this.tableEl.appendChild(tr)

        let btn = document.querySelector("#submit");
        btn.disable = false;
        this.delete();
    }
    setId(){
        let sizeLocal = localStorage.length
        let input = document.querySelector("#id");
        if(sizeLocal == 0){
            return 1
            input.value = 1;
        }else{
            return sizeLocal + 1
            input.value = sizeLocal + 1;
        }
    }
    getPhoto(value){
        return new Promise((resolve, reject)=>{
            let reader = new FileReader()
                reader.readAsDataURL(value)
                reader.onload = ()=>{
                    let base64 = reader.result
                    resolve(base64)
                };
                reader.onerror = (e)=>{
                    reject(e)
                };
        });
    }//Closing the getPhoto method. 
    getValues(form){
        return new Promise((resolve)=>{
            let user = {};
            [...form.elements].forEach((item)=>{
                if(item.name == "name" && item.value != ""){
                    user[item.name] = item.value
                }
                if(item.name == "email" && item.value != ""){
                    user[item.name] = item.value
                }
                if(item.name == "birth" && item.value != ""){
                    user[item.name] = item.value
                }
                if(item.name == "gender" && item.checked){
                    user[item.name] = item.value
                }
                if(item.name == "country" && item.value != ""){
                    user[item.name] = item.value
                }
                if(item.name == "password" && item.value != ""){
                    user[item.name] = item.value
                }
                if(item.name == "admin"){
                    let checked = document.querySelector("#admin").checked;
                    if(checked){
                        user[item.name] = "Sim"
                    }else{
                        user[item.name] = "Não"
                    }
                }
                if(item.name == "photo"){
                    if(item.files.length > 0){
                        this.getPhoto(item.files[0]).then((result)=>{
                            user["photo"] = result;
                            resolve(user)
                        })
                    }else{
                        user["photo"] = "img/userde.png";
                        let checked = document.querySelector("#admin").checked;
                        if(checked){
                            user["admin"] = "Sim"
                        }else{
                            user["admin"] = "Não"
                        }
                        resolve(user)
                    }
                }
            });
        })
    }
}//Closing de class.