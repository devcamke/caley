class RegistrationsController < ApplicationController
  layout "auth"

  before_action :set_user, only: :create
  before_action :claim_invite_code, only: :create, if: :hosted_app?

  def new
    @user = User.new
  end

  def create
    if @user.save
      @user.workspaces.create(name: "#{@user.first_name}'s Workspace'", owner_id: @user.id)
      login @user
      flash[:notice] = t(".success")
      redirect_to root_path
    else
      flash[:alert] = t(".failure")
      render :new
    end
  end

  private

  def set_user
    @user = User.new user_params.except(:invite_code)
  end

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :invite_code)
  end

  def claim_invite_code
    unless InviteCode.claim! params[:user][:invite_code]
      redirect_to new_registration_path, alert: t("registrations.create.invalid_invite_code")
    end
  end
end
