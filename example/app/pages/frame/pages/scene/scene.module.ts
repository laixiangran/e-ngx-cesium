import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SceneComponent } from './scene.component';
import { SceneRoutingModule } from './scene.routes';
import { RollerShuttersComponent } from './pages/roller-shutters/roller-shutters.component';
import { ENgxCesiumModule } from '../../../../../../src';
import { ModeSwitchComponent } from './pages/mode-switch/mode-switch.component';
import { DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { UnderGroundComponent } from './pages/under-ground/under-ground.component';
import { RenderEffectComponent } from './pages/render-effect/render-effect.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		SceneRoutingModule,
		ENgxCesiumModule,
		DropdownModule
	],
	declarations: [
		SceneComponent,
		RollerShuttersComponent,
		ModeSwitchComponent,
		UnderGroundComponent,
		RenderEffectComponent
	]
})
export class SceneModule {}
