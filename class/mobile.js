class ToggleClasses{

    //this class is used for toggle classes in .html archives

   static menuToggle(click, action, classToggle){

         let clickVar = document.querySelector(click);
         let actionVar = document.querySelector(action);
         let classToggleVar = classToggle;
        clickVar.addEventListener("click", ()=>{
            actionVar.classList.toggle(classToggleVar);

        });
    }//Closing the menuToggle method.
}