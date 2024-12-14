export const SemesterRegistrationStatus = ['UPCOMING', 'ONGOING', 'ENDED'];


// for cleang codebase | also ensures there is no spelling mistake during development
export const RegistrationStatus = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  ENDED: 'ENDED',
} as const; // as const makes property ReadOnly 
