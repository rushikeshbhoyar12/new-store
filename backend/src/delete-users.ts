import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function deleteUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Delete demo users
    const emails = ['rushikeshbhoyar15671@gmail.com','admin@demo.com', 'owner@demo.com', 'user@demo.com'];
    
    for (const email of emails) {
      try {
        const user = await usersService.findByEmail(email);
        if (user) {
          await usersService.remove(user.id);
          console.log(`✅ Deleted user: ${email}`);
        } else {
          console.log(`ℹ️  User not found: ${email}`);
        }
      } catch (error) {
        console.log(`❌ Error deleting ${email}:`, error.message);
      }
    }

    console.log('\n🎉 User cleanup completed!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await app.close();
  }
}

deleteUsers();
