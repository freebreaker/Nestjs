import { Controller, Get, Post, Body } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interface/cat.interface';

let times = 0;

@Controller('cats')
export class CatsController {

  constructor(private readonly catsService: CatsService) { }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    this.catsService.sendToKafkaMessage({
      msg: `this is a message ${++times}`,
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(`success data: ${JSON.stringify(data)}`);
    });
    return this.catsService.findAll();
  }

  @Get('consumer')
  async findKafka() {
    return this.catsService.findAll();
  }

}