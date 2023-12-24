import { GitObjectCommit, GitObjectCommitContent, createGitObjectCommitContent, parseGitObjectCommitContent } from "../../../../../src/domain/gitObject/gitObjectCommit";
import { sampleGitHash1, sampleGitHash2 } from "../../../testutil/sampleGitHash";

describe('gitObjectCommit', () => {
  it('test-1', () => {
    const sourceGitObjectCommitContent: GitObjectCommitContent = {
      tree: sampleGitHash1,
      parents: [sampleGitHash2],
      author: { name: 'author-name-1', email: 'author-email-1@example.com', dateSeconds: 123, dateTimezone: '+1234' },
      committer: { name: 'committer-name-1', email: 'committer-email-1@example.com', dateSeconds: 456, dateTimezone: '+5678' },
      message: 'sample commit message.',
    };
    const sourceGitObjectCommit: GitObjectCommit = { type: 'commit', content: sourceGitObjectCommitContent, };
    const actualBuffer = createGitObjectCommitContent(sourceGitObjectCommit);
    const expectBuffer = Buffer.concat([
      Buffer.from(`tree `), Buffer.from(sampleGitHash1), Buffer.from('\n'),
      Buffer.from(`parent `), Buffer.from(sampleGitHash2), Buffer.from('\n'),
      Buffer.from(`author `), Buffer.from(`author-name-1 <author-email-1@example.com> 123 +1234`), Buffer.from('\n'),
      Buffer.from(`committer `), Buffer.from(`committer-name-1 <committer-email-1@example.com> 456 +5678`), Buffer.from('\n'),
      Buffer.from('\n'),
      Buffer.from(`sample commit message.`),
    ]);

    expect(actualBuffer.toString('hex')).toBe(expectBuffer.toString('hex'));

    const parsedGitObjectCommit = parseGitObjectCommitContent(actualBuffer);
    expect(parsedGitObjectCommit).toStrictEqual(sourceGitObjectCommitContent);

  });
});
