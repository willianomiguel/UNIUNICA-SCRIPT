import { STANDARD_OBJECTS } from 'integracore-shared/metadata';
import { isDefined } from 'integracore-shared/utils';

import { type IntegraCoreStandardAllFlatEntityMaps } from 'src/engine/workspace-manager/integracore-standard-application/types/integracore-standard-all-flat-entity-maps.type';

const CAMPAIGN_SENDING_OBJECT_UNIVERSAL_IDENTIFIERS: string[] = [
  STANDARD_OBJECTS.campaignDelivery.universalIdentifier,
  STANDARD_OBJECTS.messageSuppression.universalIdentifier,
];

export const collectCampaignSendingStandardUniversalIdentifiers = ({
  standardAllFlatEntityMaps,
}: {
  standardAllFlatEntityMaps: IntegraCoreStandardAllFlatEntityMaps;
}): { objectMetadata: string[]; fieldMetadata: string[]; index: string[] } => {
  const belongsToCampaignSendingObject = ({
    objectMetadataUniversalIdentifier,
  }: {
    objectMetadataUniversalIdentifier: string;
  }) =>
    CAMPAIGN_SENDING_OBJECT_UNIVERSAL_IDENTIFIERS.includes(
      objectMetadataUniversalIdentifier,
    );

  const fieldMetadata = Object.values(
    standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter(belongsToCampaignSendingObject)
    .map((flatFieldMetadata) => flatFieldMetadata.universalIdentifier);

  const index = Object.values(
    standardAllFlatEntityMaps.flatIndexMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter(belongsToCampaignSendingObject)
    .map((flatIndexMetadata) => flatIndexMetadata.universalIdentifier);

  return {
    objectMetadata: CAMPAIGN_SENDING_OBJECT_UNIVERSAL_IDENTIFIERS,
    fieldMetadata,
    index,
  };
};
