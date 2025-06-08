 import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Role } from '@role/entity/role.entity';
import { Role as RoleEnum } from '@role/enum/role.enum';

export async function seedRoles(app: INestApplicationContext) {
  const configService = app.get(ConfigService);

  const shouldSeed = configService.get<string>('role.seed') === 'true';
  console.log(shouldSeed);
  

  if (!shouldSeed) {
    console.log('⏭️  Skipping role seeding: SEED_ROLES is false.');
    return;
  }

  const dataSource = app.get(DataSource);
  const roleRepo = dataSource.getRepository(Role);

  let seeded = false;

  for (const role of Object.values(RoleEnum)) {
    const exists = await roleRepo.findOne({ where: { name: role } });
    if (!exists) {
      const newRole = roleRepo.create({ name: role });
      await roleRepo.save(newRole);
      console.log(`✅ Created role: ${role}`);
      seeded = true;
    } else {
      console.log(`ℹ️ Role already exists: ${role}`);
    }
  }

  if (!seeded) {
    console.log('ℹ️ All roles already exist. Nothing to seed.');
  } else {
    console.log('✅ Role seeding completed.');
  }
}
