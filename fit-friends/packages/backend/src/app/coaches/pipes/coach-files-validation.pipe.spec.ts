import {CoachFilesValidationPipe} from './coach-files-validation.pipe';
import {mockDeep} from 'jest-mock-extended';
import {Buffer} from 'node:buffer';
import * as stream from 'stream';
import {Express} from 'express';
import {BadRequestException} from '@nestjs/common';


describe('CoachFilesValidationPipe', () => {
  it('should be defined', () => {
    const coachFilesValidationPipe = new CoachFilesValidationPipe();

    expect(coachFilesValidationPipe).toBeDefined();
  });

  const avatars: Express.Multer.File[] = [
    {
      originalname: 'avatar1.jpg',
      filename: 'avatar1',
      encoding: 'utf8',
      mimetype: 'image/jpeg',
      destination: '/',
      path: '/',
      fieldname: 'avatar',
      stream: mockDeep<stream.Readable>(),
      size: 2**10,
      buffer: mockDeep<Buffer>(),
    },
  ];

  const certificates: Express.Multer.File[] = [
    {
      originalname: 'certificate.pdf',
      filename: 'avatar1',
      encoding: 'utf8',
      mimetype: 'application/pdf',
      destination: '/',
      path: '/',
      fieldname: 'certificate',
      stream: mockDeep<stream.Readable>(),
      size: 2**20,
      buffer: mockDeep<Buffer>(),
    },
  ];

  it('should return entered value', () => {
    const coachFilesValidationPipe = new CoachFilesValidationPipe();

    const value = {
      avatar: [...avatars],
      certificate: [...certificates],
    };

    expect(coachFilesValidationPipe.transform({...value})).toStrictEqual({...value});
  });

  describe('avatar is required', () => {
    let coachFilesValidationPipe: CoachFilesValidationPipe;

    beforeEach(() => {
      coachFilesValidationPipe = new CoachFilesValidationPipe({
        avatar: {isOptional: false},
        certificate: {isOptional: true},
      });
    });

    it('should throw BadRequestException if avatar is not passed', () => {
      const value = {
        certificate: [...certificates],
      };

      expect(() => coachFilesValidationPipe.transform(value)).toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if avatar field exists but data is not passed', () => {
      const value = {
        avatar: [],
        certificate: [...certificates],
      };

      expect(() => coachFilesValidationPipe.transform(value)).toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if avatar size too large', () => {
      const value = {
        avatar: [
          {
            ...avatars[0],
            size: 2**100,
          }
        ],
        certificate: [...certificates],
      };

      expect(() => coachFilesValidationPipe.transform(value)).toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if avatar has wrong mime type', () => {
      const value = {
        avatar: [
          {
            ...avatars[0],
            mimetype: 'application/json',
          }
        ],
        certificate: [...certificates],
      };

      expect(() => coachFilesValidationPipe.transform(value)).toThrowError(BadRequestException);
    });
  });

  describe('certificate is required', () => {
    let coachFilesValidationPipe: CoachFilesValidationPipe;

    beforeEach(() => {
      coachFilesValidationPipe = new CoachFilesValidationPipe({
        avatar: {isOptional: true},
        certificate: {isOptional: false},
      });
    });

    it('should throw BadRequestException if certificate is not passed', () => {
      const value = {
        avatar: [
          ...avatars,
        ],
      };

      expect(() => coachFilesValidationPipe.transform(value)).toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if certificate field exists but data is not passed', () => {
      const value = {
        avatar: [
          ...avatars,
        ],
        certificate: [],
      };

      expect(() => coachFilesValidationPipe.transform(value)).toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if certificate has wrong mime type', () => {
      const value = {
        avatar: [...avatars],
        certificate: [{
          ...certificates[0],
          mimetype: 'application/json',
        }],
      };

      expect(() => coachFilesValidationPipe.transform(value)).toThrowError(BadRequestException);
    });
  });
});
