"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignStatus = void 0;
/**;
 * Marketing CRM Module Models;
 * TypeScript interfaces corresponding to the Prisma schema for Marketing CRM;
 */ ;
// Contact Note Model;
// Marketing Activity Model;
// Contact Segment Model;
// Segment Member Model;
// Campaign Segment Model (Many-to-Many);
// Lead Model;
// Lead Activity Model;
// Campaign Analytics Model;
// Marketing Template Model;
// Marketing Event Model;
// Event Registration Model;
// User interface (partial, only for marketing relations);
// Campaign Status enum;
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "DRAFT";
    CampaignStatus["SCHEDULED"] = "SCHEDULED";
    CampaignStatus["ACTIVE"] = "ACTIVE";
    CampaignStatus["PAUSED"] = "PAUSED";
    CampaignStatus["COMPLETED"] = "COMPLETED";
    CampaignStatus["CANCELLED"] = "CANCELLED";
    // Campaign Type enum;
    CampaignStatus[CampaignStatus["export"] = void 0] = "export";
    CampaignStatus[CampaignStatus["enum"] = void 0] = "enum";
    CampaignStatus[CampaignStatus["CampaignType"] = void 0] = "CampaignType";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
{
    EMAIL = "EMAIL",
        SMS = "SMS",
        SOCIAL_MEDIA = "SOCIAL_MEDIA",
        EVENT = "EVENT",
        PRINT = "PRINT",
        DIGITAL_AD = "DIGITAL_AD",
        OTHER = "OTHER",
    ;
    // Channel Type enum;
    let ChannelType;
    (function (ChannelType) {
        ChannelType["EMAIL"] = "EMAIL";
        ChannelType["SMS"] = "SMS";
        ChannelType["SOCIAL_MEDIA"] = "SOCIAL_MEDIA";
        ChannelType["EVENT"] = "EVENT";
        ChannelType["PRINT"] = "PRINT";
        ChannelType["DIGITAL_AD"] = "DIGITAL_AD";
        ChannelType["OTHER"] = "OTHER";
        // Message Status enum;
        ChannelType[ChannelType["export"] = void 0] = "export";
        ChannelType[ChannelType["enum"] = void 0] = "enum";
        ChannelType[ChannelType["MessageStatus"] = void 0] = "MessageStatus";
    })(ChannelType || (ChannelType = {}));
    {
        DRAFT = "DRAFT",
            SCHEDULED = "SCHEDULED",
            SENT = "SENT",
            FAILED = "FAILED",
        ;
        // Interaction Type enum;
        let InteractionType;
        (function (InteractionType) {
            InteractionType["OPEN"] = "OPEN";
            InteractionType["CLICK"] = "CLICK";
            InteractionType["REPLY"] = "REPLY";
            InteractionType["UNSUBSCRIBE"] = "UNSUBSCRIBE";
            InteractionType["BOUNCE"] = "BOUNCE";
            // Contact Status enum;
            InteractionType[InteractionType["export"] = void 0] = "export";
            InteractionType[InteractionType["enum"] = void 0] = "enum";
            InteractionType[InteractionType["ContactStatus"] = void 0] = "ContactStatus";
        })(InteractionType || (InteractionType = {}));
        {
            ACTIVE = "ACTIVE",
                INACTIVE = "INACTIVE",
                UNSUBSCRIBED = "UNSUBSCRIBED",
                BOUNCED = "BOUNCED",
            ;
            // Lead Status enum;
            let LeadStatus;
            (function (LeadStatus) {
                LeadStatus["NEW"] = "NEW";
                LeadStatus["CONTACTED"] = "CONTACTED";
                LeadStatus["QUALIFIED"] = "QUALIFIED";
                LeadStatus["CONVERTED"] = "CONVERTED";
                LeadStatus["LOST"] = "LOST";
                // Lead Source enum;
                LeadStatus[LeadStatus["export"] = void 0] = "export";
                LeadStatus[LeadStatus["enum"] = void 0] = "enum";
                LeadStatus[LeadStatus["LeadSource"] = void 0] = "LeadSource";
            })(LeadStatus || (LeadStatus = {}));
            {
                WEBSITE = "WEBSITE",
                    REFERRAL = "REFERRAL",
                    EVENT = "EVENT",
                    ADVERTISEMENT = "ADVERTISEMENT",
                    SOCIAL_MEDIA = "SOCIAL_MEDIA",
                    OTHER = "OTHER",
                ;
                // Event Status enum;
                let EventStatus;
                (function (EventStatus) {
                    EventStatus["PLANNED"] = "PLANNED";
                    EventStatus["OPEN"] = "OPEN";
                    EventStatus["FULL"] = "FULL";
                    EventStatus["ONGOING"] = "ONGOING";
                    EventStatus["COMPLETED"] = "COMPLETED";
                    EventStatus["CANCELLED"] = "CANCELLED";
                    // Registration Status enum;
                    EventStatus[EventStatus["export"] = void 0] = "export";
                    EventStatus[EventStatus["enum"] = void 0] = "enum";
                    EventStatus[EventStatus["RegistrationStatus"] = void 0] = "RegistrationStatus";
                })(EventStatus || (EventStatus = {}));
                {
                    REGISTERED = "REGISTERED",
                        CONFIRMED = "CONFIRMED",
                        ATTENDED = "ATTENDED",
                        NO_SHOW = "NO_SHOW",
                        CANCELLED = "CANCELLED";
                }
            }
        }
    }
}
