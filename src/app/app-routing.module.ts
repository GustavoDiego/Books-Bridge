import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


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
    },
    {
      path:'statistics',
      loadChildren:()=>
        import('./modules/statistics/statistics.module').then(
          (m)=> m.StatisticsModule
        )
    }


];


@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy: PreloadAllModules,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
