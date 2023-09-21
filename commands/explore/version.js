class Version {
  constructor(versionString) {
    const version = versionString.split('.');
    this.v1 = parseInt(version[0]);
    this.v2 = parseInt(version[1]);
    this.v3 = parseInt(version[2]);
  }

  compareTo(version2) {
    if (this.v1 > version2.v1) {
      return 1;
    } if (this.v1 < version2.v1) {
      return -1;
    }
    if (this.v2 > version2.v2) {
      return 1;
    } if (this.v2 < version2.v2) {
      return -1;
    }
    if (this.v3 > version2.v3) {
      return 1;
    } if (this.v3 < version2.v3) {
      return -1;
    }
    return 0;
  }
}

module.exports = Version;
