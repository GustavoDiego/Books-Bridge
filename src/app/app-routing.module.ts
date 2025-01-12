import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

<<<<<<< Updated upstream
const routes: Routes = [];
=======
const routes: Routes = [
  {
    path:'',
    redirectTo:'books',
    pathMatch:'full'
  },
  {
    path:'books',
    loadChildren:()=>
      import('./modules/books/books.module').then(
        (m)=> m.BooksModule
      )
    }

];
>>>>>>> Stashed changes

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy: PreloadAllModules,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
