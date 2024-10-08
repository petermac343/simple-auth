import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'mysql',
});

export class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export class Profile extends Model {}
Profile.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  about_me: DataTypes.TEXT,
  industrial_field: DataTypes.STRING,
  preferred_locations: DataTypes.STRING,
  preferred_job_titles: DataTypes.STRING,
  race: DataTypes.STRING,
  resume_path: DataTypes.STRING,
  coverletter_path: DataTypes.STRING,
  salary_expectations: DataTypes.STRING,
  work_environment_preference: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'Profile',
  tableName: 'profiles',
  timestamps: false,
});

export class JobApplication extends Model {}
JobApplication.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  date_applied: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  job_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source: DataTypes.STRING,
  job_link: DataTypes.STRING,
  job_type: DataTypes.STRING,
  salary_range: DataTypes.STRING,
  location: DataTypes.STRING,
  deadline: DataTypes.DATE,
  job_description: DataTypes.TEXT,
  cv_used: DataTypes.STRING,
  cover_letter: DataTypes.STRING,
  status: DataTypes.STRING,
  status_history: DataTypes.TEXT,
  points_to_note: DataTypes.TEXT,
}, {
  sequelize,
  modelName: 'JobApplication',
  tableName: 'job_applications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

User.hasOne(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(JobApplication, { foreignKey: 'user_id' });
JobApplication.belongsTo(User, { foreignKey: 'user_id' });

export { sequelize };