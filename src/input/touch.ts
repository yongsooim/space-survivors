
import { viewport } from '../main'

class Touch {

    isPressed = {
        Up : false,
        Down : false,
        Right: false,
        Left: false
    }

    init(){
        viewport.on("touchmove", (e) => {

            let xRatio = e.touches[0].clientX / document.body.clientHeight;
            let yRatio = e.touches[0].clientY / document.body.clientWidth;
      
            if (yRatio / xRatio <= 1 && (1 - yRatio) / xRatio >= 1) {
              this.isPressed.Up = true
              this.isPressed.Down = false
              this.isPressed.Right = false
              this.isPressed.Left = false
            }
            else if (yRatio / xRatio > 1 && (1 - yRatio) / xRatio < 1){
                this.isPressed.Up = false
                this.isPressed.Down = true
                this.isPressed.Right = false
                this.isPressed.Left = false
              }
            else if ((1 - yRatio) / xRatio < 1 && yRatio / xRatio <= 1){
                this.isPressed.Up = false
                this.isPressed.Down = false
                this.isPressed.Right = true
                this.isPressed.Left = false
              }
            else if ((1 - yRatio) / xRatio >= 1 && yRatio / xRatio > 1){
                this.isPressed.Up = false
                this.isPressed.Down = false
                this.isPressed.Right = false
                this.isPressed.Left = true
              }
      
          });
      
          document.body.addEventListener("touchend", (e) => {
            this.isPressed.Up = false
            this.isPressed.Down = false
            this.isPressed.Right = false
            this.isPressed.Left = false
          })

          document.body.addEventListener("touchstart", (e) => {
      
      
            let xRatio = e.touches[0].clientX / document.body.clientHeight;
            let yRatio = e.touches[0].clientY / document.body.clientWidth;
      
            if (yRatio / xRatio <= 1 && (1 - yRatio) / xRatio >= 1) {
                this.isPressed.Up = true
                this.isPressed.Down = false
                this.isPressed.Right = false
                this.isPressed.Left = false
            }
            else if (yRatio / xRatio > 1 && (1 - yRatio) / xRatio < 1){
                this.isPressed.Up = false
                this.isPressed.Down = true
                this.isPressed.Right = false
                this.isPressed.Left = false
            }
            else if ((1 - yRatio) / xRatio < 1 && yRatio / xRatio <= 1){
                this.isPressed.Up = false
                this.isPressed.Down = false
                this.isPressed.Right = true
                this.isPressed.Left = false
            }
            else if ((1 - yRatio) / xRatio >= 1 && yRatio / xRatio > 1){
                this.isPressed.Up = false
                this.isPressed.Down = false
                this.isPressed.Right = false
                this.isPressed.Left = true
            }
      
          });


          
          viewport.on("mousemove", (e) => {
      
      
            let xRatio = e.clientX / document.body.clientHeight;
            let yRatio = e.clientY / document.body.clientWidth;
      
            if (yRatio / xRatio <= 1 && (1 - yRatio) / xRatio >= 1) {
                this.isPressed.Up = true
                this.isPressed.Down = false
                this.isPressed.Right = false
                this.isPressed.Left = false
            }
            else if (yRatio / xRatio > 1 && (1 - yRatio) / xRatio < 1){
                this.isPressed.Up = false
                this.isPressed.Down = true
                this.isPressed.Right = false
                this.isPressed.Left = false
            }
            else if ((1 - yRatio) / xRatio < 1 && yRatio / xRatio <= 1){
                this.isPressed.Up = false
                this.isPressed.Down = false
                this.isPressed.Right = true
                this.isPressed.Left = false
            }
            else if ((1 - yRatio) / xRatio >= 1 && yRatio / xRatio > 1){
                this.isPressed.Up = false
                this.isPressed.Down = false
                this.isPressed.Right = false
                this.isPressed.Left = true
            }
      
          });

      
    }

}

export const touch = new Touch()