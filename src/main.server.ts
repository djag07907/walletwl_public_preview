import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "@core/app.component";
import { config } from "@core/app.config.server";

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
