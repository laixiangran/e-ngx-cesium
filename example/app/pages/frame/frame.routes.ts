import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrameComponent } from './frame.component';

const frameRoutes: Routes = [
	{
		path: '',
		component: FrameComponent,
		children: [
			{
				path: 'onlineMap',
				loadChildren: './pages/onlineMap/onlineMap.module#OnlineMapModule',
			},
			{
				path: 'scene',
				loadChildren: './pages/scene/scene.module#SceneModule',
			},
			{
				path: '',
				redirectTo: 'onlineMap',
				pathMatch: 'full'
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(frameRoutes)
	],
	exports: [
		RouterModule
	]
})

export class FrameRoutingModule {
}
