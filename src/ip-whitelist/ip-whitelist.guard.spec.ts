import { IpWhitelistGuard } from './ip-whitelist.guard';

describe('IpWhitelistGuard', () => {
  it('should be defined', () => {
    expect(new IpWhitelistGuard()).toBeDefined();
  });
});
