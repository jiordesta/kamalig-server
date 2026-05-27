import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDTO } from 'src/libs/dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('fetchall')
  async fetchAllReports() {
    return await this.reportService.fetchAllReports();
  }

  @Post('create')
  async createReport(@Body() createReportDTO: CreateReportDTO) {
    return await this.reportService.createReport(createReportDTO);
  }

  @Get('display')
  async displayReport(@Query('reportId', ParseIntPipe) reportId: number) {
    return await this.reportService.displayReport(reportId);
  }
}
