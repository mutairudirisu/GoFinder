import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { Listing } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(createListingDto: CreateListingDto, hostId: string): Promise<Listing> {
    return this.prisma.listing.create({
      data: {
        ...createListingDto,
        hostId,
        images: createListingDto.images || [],
        amenities: createListingDto.amenities || [],
      },
    });
  }

  async findAll(): Promise<Listing[]> {
    return this.prisma.listing.findMany({
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }
    return listing;
  }

  async remove(id: string, hostId: string): Promise<Listing> {
    // Ensure listing exists and belongs to host
    const listing = await this.findOne(id);
    if (listing.hostId !== hostId) {
      throw new NotFoundException('You do not own this listing');
    }
    return this.prisma.listing.delete({
      where: { id },
    });
  }
}
