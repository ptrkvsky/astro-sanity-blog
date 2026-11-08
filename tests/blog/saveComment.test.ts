import { saveComment } from '../../src/features/blog/functions/saveComment';

const payload = {
  _id: 'post-1',
  postTitle: 'Article',
  pseudo: ' Alice ',
  comment: ' Bonjour ',
};
const request = (body: unknown = payload, contentType = 'application/json') =>
  new Request('https://example.com/api/save-comment.json', {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: JSON.stringify(body),
  });
const dependencies = () => ({
  save: jest.fn().mockResolvedValue({ _id: 'comment-1', content: 'private' }),
  notify: jest.fn().mockResolvedValue(undefined),
});

beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test.each([
  'application/json',
  'application/json; charset=UTF-8',
  'Application/JSON; charset=utf-8',
])(
  'enregistre avant de notifier avec %s et conserve la modération',
  async (contentType) => {
    const deps = dependencies();
    const response = await saveComment(request(payload, contentType), deps);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ _id: 'comment-1' });
    expect(deps.save).toHaveBeenCalledWith({
      _type: 'comment',
      post: { _type: 'reference', _ref: 'post-1' },
      pseudo: 'Alice',
      content: 'Bonjour',
      isActive: false,
    });
    expect(deps.save.mock.invocationCallOrder[0]).toBeLessThan(
      deps.notify.mock.invocationCallOrder[0],
    );
  },
);
test('une panne e-mail ne transforme pas un enregistrement réussi en erreur', async () => {
  const deps = dependencies();
  deps.notify.mockRejectedValue(new Error('Brevo unavailable'));
  expect((await saveComment(request(), deps)).status).toBe(200);
  expect(deps.save).toHaveBeenCalledTimes(1);
});
test('une panne Sanity ne déclenche aucune notification', async () => {
  const deps = dependencies();
  deps.save.mockRejectedValue(new Error('secret upstream error'));
  const response = await saveComment(request(), deps);
  expect(response.status).toBe(500);
  expect(await response.text()).not.toContain('secret');
  expect(deps.notify).not.toHaveBeenCalled();
});
test.each([
  null,
  [],
  { ...payload, pseudo: ' ' },
  { ...payload, comment: 3 },
  { ...payload, comment: 'x'.repeat(10001) },
  { ...payload, pseudo: 'x'.repeat(101) },
  { ...payload, _id: 'drafts.post-1' },
  { ...payload, _id: '' },
])('rejette les données invalides : %j', async (body) => {
  const deps = dependencies();
  expect((await saveComment(request(body), deps)).status).toBe(400);
  expect(deps.save).not.toHaveBeenCalled();
  expect(deps.notify).not.toHaveBeenCalled();
});
test('rejette un JSON malformé ou un autre type de contenu', async () => {
  const deps = dependencies();
  const malformed = new Request('https://example.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  });
  expect((await saveComment(malformed, deps)).status).toBe(400);
  expect((await saveComment(request(payload, 'text/plain'), deps)).status).toBe(
    415,
  );
  expect(deps.save).not.toHaveBeenCalled();
});
