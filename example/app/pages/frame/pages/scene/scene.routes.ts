import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SceneComponent } from './scene.component';
import { RollerShuttersComponent } from './pages/roller-shutters/roller-shutters.component';
import { ModeSwitchComponent } from './pages/mode-switch/mode-switch.component';
import { UnderGroundComponent } from './pages/under-ground/under-ground.component';

const SceneRoutes: Routes = [
	{
		path: '',
		component: SceneComponent,
		children: [
			{
				path: 'rollerShutters',
				component: RollerShuttersComponent
			},
			{
				path: 'modeSwitch',
				component: ModeSwitchComponent
			},
			{
				path: 'underGround',
				component: UnderGroundComponent
			},
			{
				path: '',
				redirectTo: 'rollerShutters',
				pathMatch: 'full'
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(SceneRoutes)
	],
	exports: [
		RouterModule
	]
})
export class SceneRoutingModule {
}
