import umami from '@umami/node';

umami.init({
    websiteId: 'e6e9c133-5635-4466-b7d9-f9b650c28aed', // Your website id
    hostUrl: 'https://cloud.umami.is', // URL to your Umami instance
});

export const umamiTrackCheckoutSuccessEvent = async (payload: {
    [key: string]: string | number | Date
}) => {
    await umami.track('checkout_success', payload);
}