import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { StoresService } from './stores/stores.service';
import { UserRole } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const storesService = app.get(StoresService);

  try {
    // Clear existing demo users to avoid double-hashing issues
    console.log('🧹 Clearing existing demo users...');
    const demoEmails = [
      'admin@demo.com', 
      'john@electronics.com', 
      'sarah@fashion.com', 
      'mike@books.com', 
      'emma@groceries.com',
      'user@demo.com'
    ];

    for (const email of demoEmails) {
      try {
        const user = await usersService.findByEmail(email);
        if (user) {
          await usersService.remove(user.id);
          console.log(`✅ Removed existing user: ${email}`);
        }
      } catch (error) {
        console.log(`ℹ️  User ${email} not found, skipping`);
      }
    }

    // Create Admin User
    const adminEmail = 'admin@demo.com';
    const hashedAdminPassword = await bcrypt.hash('Password123!', 10);
    const admin = await usersService.create({
      name: 'System Administrator',
      email: adminEmail,
      password: hashedAdminPassword,
      address: '123 Admin Street, Admin City, AC 12345',
      role: UserRole.ADMIN,
    });
    console.log('✅ Admin user created:', admin.email);

    // Create Multiple Store Owners with their stores
    const storeOwnersData = [
      {
        name: 'John Smith',
        email: 'john@electronics.com',
        address: '456 Business Ave, Commerce City, CC 67890',
        stores: [
          {
            name: 'TechWorld Electronics',
            address: '789 Market Street, Shopping District, SD 11111'
          },
          {
            name: 'Smart Gadgets Hub',
            address: '321 Innovation Drive, Tech Valley, TV 22222'
          }
        ]
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@fashion.com',
        address: '123 Style Street, Fashion District, FD 33333',
        stores: [
          {
            name: 'Trendy Boutique',
            address: '567 Chic Avenue, Style City, SC 44444'
          }
        ]
      },
      {
        name: 'Mike Chen',
        email: 'mike@books.com',
        address: '890 Literature Lane, Book Town, BT 55555',
        stores: [
          {
            name: 'Pages & Coffee',
            address: '234 Reading Road, Library District, LD 66666'
          },
          {
            name: 'Academic Books Store',
            address: '678 Knowledge Street, University Area, UA 77777'
          },
          {
            name: 'Kids Story Corner',
            address: '345 Fairy Tale Lane, Family District, FD 88888'
          }
        ]
      },
      {
        name: 'Emma Davis',
        email: 'emma@groceries.com',
        address: '456 Fresh Market Ave, Food City, FC 99999',
        stores: [
          {
            name: 'Fresh Market Express',
            address: '789 Organic Street, Green Valley, GV 11110'
          }
        ]
      }
    ];

    for (const ownerData of storeOwnersData) {
      try {
        // Create store owner
        const hashedOwnerPassword = await bcrypt.hash('Password123!', 10);
        const owner = await usersService.create({
          name: ownerData.name,
          email: ownerData.email,
          password: hashedOwnerPassword,
          address: ownerData.address,
          role: UserRole.STORE_OWNER,
        });
        console.log('✅ Store Owner user created:', owner.email);

        // Create stores for this owner
        for (const storeData of ownerData.stores) {
          try {
            await storesService.create({
              name: storeData.name,
              email: ownerData.email,
              address: storeData.address,
              ownerId: owner.id,
            });
            console.log(`✅ Store created: ${storeData.name}`);
          } catch (error) {
            console.log(`ℹ️  Store ${storeData.name} might already exist`);
          }
        }
      } catch (error) {
        console.log(`ℹ️  Store owner ${ownerData.email} might already exist`);
      }
    }

    // Create Regular User
    const userEmail = 'user@demo.com';
    const userExists = await usersService.findByEmail(userEmail).catch(() => null);

    if (!userExists) {
      const hashedUserPassword = await bcrypt.hash('Password123!', 10);
      const user = await usersService.create({
        name: 'Regular User Demo',
        email: userEmail,
        password: hashedUserPassword,
        address: '321 User Lane, Customer City, UC 54321',
        role: UserRole.USER,
      });
      console.log('✅ Regular user created:', user.email);
    } else {
      console.log('ℹ️  Regular user already exists');
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('👤 Admin:');
    console.log('  • admin@demo.com / Password123!');
    console.log('\n🏪 Store Owners:');
    console.log('  • john@electronics.com / Password123! (TechWorld Electronics, Smart Gadgets Hub)');
    console.log('  • sarah@fashion.com / Password123! (Trendy Boutique)');
    console.log('  • mike@books.com / Password123! (Pages & Coffee, Academic Books Store, Kids Story Corner)');
    console.log('  • emma@groceries.com / Password123! (Fresh Market Express)');
    console.log('\n👥 Regular User:');
    console.log('  • user@demo.com / Password123!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed();