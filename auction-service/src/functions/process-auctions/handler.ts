import { closeAuction } from '@libs/closeAuction';
import { getEndedAuctions } from '@libs/getEndedAuctions';
import { middyfy } from '@libs/lambda';


const processAuctions = async (event) => {
  const auctionsToClose = await getEndedAuctions();
  const closePromises = auctionsToClose.map(auction => closeAuction(auction));
  await Promise.all(closePromises);
  return { closed: closePromises.length };

};

export const main = middyfy(processAuctions);
