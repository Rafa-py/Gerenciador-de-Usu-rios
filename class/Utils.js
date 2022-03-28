class Utils{

    static dateFormat(date){ // Método estático, não precisa ser instaciado. Não necessita do constructor tb. 
        return date.getDate()+'/'+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    }

}