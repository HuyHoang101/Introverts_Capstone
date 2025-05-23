// generate-data.js
const fs = require('fs');
const path = require('path');

const startDate = new Date('2025-05-01');

// Tạo danh sách 20 ngày cách nhau 7 ngày
const generateDates = () =>
  Array.from({ length: 20 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i * 7);
    return d.toISOString().split('T')[0];
  });

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const dates = generateDates();

// WATER
const water = dates.map(date => ({ date, liters: rand(1400, 1800) }));

// POPULATION
const population = dates.map(date => ({ date, people: rand(4900, 5300) }));

// AIR
const air = dates.map(date => ({
  date,
  temperature: rand(26, 34),
  CO2: rand(390, 450),
}));

// TRANSPORTATION
const transportation = dates.map(date => ({
  date,
  bike: rand(80, 200),
  motorbike: rand(280, 500),
  car: rand(130, 350),
}));

// ELECTRIC
const electric = dates.map(date => ({ date, kwh: rand(1800, 2600) }));

// Ghi từng file
const writeJSON = (filename, data) => {
  fs.writeFileSync(
    path.join(__dirname, filename),
    JSON.stringify(data, null, 2),
    'utf-8'
  );
};

writeJSON('water.json', water);
writeJSON('population.json', population);
writeJSON('air.json', air);
writeJSON('transportation.json', transportation);
writeJSON('electric.json', electric);

console.log('✅ Đã tạo dữ liệu JSON ngẫu nhiên!');
