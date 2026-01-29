import { bot } from './bot';
import { coreModule } from './modules/core/core.module';

export async function bootstrap() {
  try {
    coreModule(bot);

    bot.catch((error) => {
      console.log(
        `Bot error handler => errorName: ${error.name}, errorMessage: ${error.message}, errorStack: ${error.stack}, error: ${error.error}`,
      );
    });

    await bot.start({
      onStart: () => {
        console.log('Bot is running....');
      },
    });
  } catch (err) {
    console.error(`Bootstrap error handler => errorMessage: ${err.message}. errDetails: ${err.stack}`);
  }
}
