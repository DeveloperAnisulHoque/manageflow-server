import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly companyName: string;
  private readonly currentYear: string;
  private readonly appUrl: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    // Load company name from environment config or use default
    this.companyName = this.configService.get<string>('APP_NAME') || 'Our Company';
    // Get the current year as string for email footers or templates
    this.currentYear = new Date().getFullYear().toString();
    // Base URL for links used in emails (should be updated as needed)
    this.appUrl = "/";
  }

  /**
   * Send a welcome email to a new user after registration.
   * @param to - Recipient email address
   * @param name - Recipient's name for personalization
   */
  async sendWelcomeEmail(to: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `Welcome to ${this.companyName}`,
        template: 'welcome',
        context: {
          name,
          companyName: this.companyName,
          year: this.currentYear,
          ctaLink: '/',
        },
      });
    } catch (error) {
      console.error('Email send failed:', error);
      throw new InternalServerErrorException('Email sending failed');
    }
  }

  /**
   * Send a password reset email with a reset link.
   * @param to - Recipient email address
   * @param resetLink - Password reset URL
   */
  async sendResetPasswordEmail(to: string, resetLink: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Reset Your Password',
        template: 'reset-password',
        context: { resetLink },
      });
    } catch (error) {
      console.error('Reset password email failed:', error);
      throw new InternalServerErrorException('Email sending failed');
    }
  }

  /**
   * Send an OTP code email for two-factor authentication or verification.
   * @param to - Recipient email address
   * @param name - Recipient's name for personalization
   * @param otpCode - One-time password code
   */
  async sendOtpEmail(to: string, name: string, otpCode: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Your OTP Code',
        template: 'otp',
        context: {
          name,
          companyName: this.companyName,
          year: this.currentYear,
          otpCode,
        },
      });
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      // No exception thrown here to avoid blocking the flow due to OTP email failure
    }
  }

  /**
   * Notify user about account deactivation with reactivation link and retention info.
   * @param to - Recipient email address
   * @param name - Recipient's name
   * @param reactivationLink - URL to reactivate account
   * @param dataRetentionPeriod - Duration user data will be retained (default 30 days)
   * @param deletionDate - Scheduled data deletion date (default 30 days from now)
   */
  async sendAccountDeactivationEmail(
    to: string,
    name: string,
    reactivationLink: string,
    dataRetentionPeriod: string = '30 days',
    deletionDate: string = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `Your ${this.companyName} Account Has Been Deactivated`,
        template: 'account-deactivation',
        context: {
          name,
          companyName: this.companyName,
          year: this.currentYear,
          reactivationLink,
          dataRetentionPeriod,
          deletionDate,
        },
      });
    } catch (error) {
      console.error('Account deactivation email failed:', error);
      throw new InternalServerErrorException('Failed to send deactivation email');
    }
  }

  /**
   * Send an account reactivation email with login link.
   * @param to - Recipient email address
   * @param name - Recipient's name
   * @param loginLink - URL for user login
   */
  async sendAccountReactivationEmail(to: string, name: string, loginLink: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `Welcome Back to ${this.companyName}!`,
        template: 'account-reactivation',
        context: {
          name,
          companyName: this.companyName,
          year: this.currentYear,
          loginLink,
        },
      });
    } catch (error) {
      console.error('Account reactivation email failed:', error);
      throw new InternalServerErrorException('Failed to send reactivation email');
    }
  }

  /**
   * Send an invitation email to join a project or team.
   * @param recipientEmail - Invitee email address
   * @param recipientName - Invitee name
   * @param inviterName - Name of the person sending the invite
   * @param targetType - Type of entity ('project' or 'team')
   * @param targetName - Name of the project or team
   * @param roleName - Role assigned to invitee
   * @param acceptToken - Unique token to accept the invitation
   * @param daysToExpire - Number of days before invitation expires (default 7)
   */
  async sendInvitationEmail(
    recipientEmail: string,
    recipientName: string,
    inviterName: string,
    targetType: 'project' | 'team',
    targetName: string,
    roleName: string,
    acceptToken: string,
    daysToExpire: number = 7,
  ) {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysToExpire);

      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: `Invitation to Join ${targetName} ${targetType}`,
        template: 'invitation-join',
        context: {
          recipientName,
          inviterName,
          targetType,
          targetName,
          roleName,
          expiryDate: expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          acceptLink: `${this.appUrl}/accept-invite?token=${acceptToken}`,
          declineLink: `${this.appUrl}/decline-invite?token=${acceptToken}`,
          companyName: this.companyName,
          year: this.currentYear,
        },
      });
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      throw new InternalServerErrorException('Failed to send invitation');
    }
  }

  /**
   * Notify admin when a user accepts an invitation to join a project or team.
   * @param adminEmail - Admin email address
   * @param adminName - Admin name
   * @param newMemberName - Name of the new member who joined
   * @param newMemberEmail - Email of the new member
   * @param targetType - 'project' or 'team'
   * @param targetName - Name of the project or team
   * @param roleName - Role assigned to new member
   */
  async sendInvitationAcceptedEmail(
    adminEmail: string,
    adminName: string,
    newMemberName: string,
    newMemberEmail: string,
    targetType: 'project' | 'team',
    targetName: string,
    roleName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: adminEmail,
        subject: `${newMemberName} Joined ${targetName}`,
        template: 'invitation-accepted',
        context: {
          adminName,
          newMemberName,
          newMemberEmail,
          targetType,
          targetName,
          roleName,
          joinDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          teamLink: `${this.appUrl}/${targetType}s/${encodeURIComponent(targetName)}`,
          companyName: this.companyName,
          year: this.currentYear,
        },
      });
    } catch (error) {
      console.error('Failed to send invitation accepted email:', error);
      throw new InternalServerErrorException('Failed to send acceptance notification');
    }
  } 

  /**
   * Notify user about changes in their role within a project or team.
   * @param userEmail - User's email address
   * @param userName - User's name
   * @param adminName - Name of admin who changed the role
   * @param targetType - 'project' or 'team'  
   * @param targetName - Name of the project or team 
   * @param oldRole - Previous role of the user
   * @param newRole - Updated role of the user 
   * @param newPermissions - List of permissions associated with the new role
   */
  async sendRoleChangedEmail(
    userEmail: string,
    userName: string,
    adminName: string,
    targetType: 'project' | 'team',
    targetName: string,
    oldRole: string,
    newRole: string,  
    newPermissions: string[],
  ) {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: `Your Role in ${targetName} Has Been Updated`,
        template: 'role-changed',
        context: {
          userName,
          adminName,
          targetType,
          targetName,
          oldRole,
          newRole,
          newPermissions,
          changeDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          targetLink: `${this.appUrl}/${targetType}s/${encodeURIComponent(targetName)}`,
          companyName: this.companyName,
          year: this.currentYear,
        },
      });
    } catch (error) {
      console.error('Failed to send role changed email:', error);
      throw new InternalServerErrorException('Failed to send role change notification');
    }
  }



  /**
   * Sends a notification email to the creator upon successful project creation.
   * Includes project details and useful links like dashboard and support.
   *
   * @param creatorEmail - Email address of the project creator.
   * @param creatorName - Name of the project creator.
   * @param projectDetails - Object containing project metadata (name, id, type, description).
   * @param projectLink - Direct URL to the created project.
   *
   * @throws InternalServerErrorException if email sending fails.
   */
  async sendProjectCreatedEmail(
    creatorEmail: string,
    creatorName: string,
    projectDetails: {
      name: string;
      id: string;
      type: string;
      description?: string;
    },
    projectLink: string
  ) {
    try {
      await this.mailerService.sendMail({
        to: creatorEmail,
        subject: `Project Created: ${projectDetails.name}`,
        template: 'project-created',
        context: {
          creatorName,
          projectName: projectDetails.name,
          projectId: projectDetails.id,
          projectType: projectDetails.type,
          projectDescription: projectDetails.description,
          projectLink,
          dashboardLink: `${this.appUrl}/dashboard`,
          companyName: this.companyName,
          year: this.currentYear,
          supportLink: `${this.appUrl}/support`,
          creationDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      });
    } catch (error) {
      console.error('Project creation email failed:', error);
      throw new InternalServerErrorException('Failed to send project creation email');
    }
  }
}
